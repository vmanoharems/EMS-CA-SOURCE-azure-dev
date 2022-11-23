SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[APVendorsCheckExisting]-- APVendorsCheckExisting '{ "field to check name":"TaxID" , "field to check value":"TRE227898" , "existing record":198 }'
@JSONparameters as varchar(max)
AS
BEGIN
SET NOCOUNT ON;
if ISJSON(@JSONparameters) is null return

declare	@checkfield nvarchar(20) = JSON_VALUE(@JSONparameters,'$."field to check name"');
declare	@checkvalue nvarchar(100) = JSON_VALUE(@JSONparameters,'$."field to check value"');
declare	@existingrecord int = cast(JSON_VALUE(@JSONparameters,'$."existing record"') as int);

select top 1 @existingrecord = CASE WHEN E.VendorID is null THEN V.VendorID ELSE E.VendorID END -- Get the first record only; If the record matches the existing record, it will be the value. Otherwise, it's NULL
	from tblVendor V
	left join (select @existingrecord as VendorID) as E on V.VendorID = E.VendorID
	where (VendorName = @checkvalue and @checkfield = 'VendorName') 
	OR (VendorNumber = @checkvalue and @checkfield = 'VendorNumber')  
	OR (TaxID = @checkvalue  and @checkfield = 'TaxID')
order by E.VendorID DESC -- Ordering DESC will place NULLS at the top

SET @JSONparameters = JSON_MODIFY(@JSONparameters,'$."existing record"',@existingrecord)
select @JSONparameters AS RESULT;

END
GO