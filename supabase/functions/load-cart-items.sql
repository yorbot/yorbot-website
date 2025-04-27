
CREATE OR REPLACE FUNCTION public.load_cart_items(p_user_id UUID)
RETURNS TABLE (
  product_id INTEGER,
  product_name TEXT,
  product_image TEXT,
  price NUMERIC,
  quantity INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ci.product_id,
    ci.product_name,
    ci.product_image,
    ci.price,
    ci.quantity
  FROM cart_items ci
  WHERE ci.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
