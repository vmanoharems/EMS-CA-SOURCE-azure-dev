SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[GEtAllUserInfo]
@ProdId INT
AS
BEGIN
	SET NOCOUNT ON;
	SELECT Name, UserID
	from (
		--SELECT 'EMS Support' as Name,-1 as UserID, 1 as idx 
		--UNION ALL
		SELECT  CAU.Name as Name,CAU.UserID as UserID, ROW_NUMBER() OVER (ORDER BY CAU.Name) as idx
		FROM CAUsers CAU
		join UserProduction UP on CAU.UserID = UP.UserID and UP.ProdID = @ProdId
		where CAU.ProdId = @ProdId
	) t order by idx
END
GO